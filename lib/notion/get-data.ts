import notion from "./notion";
import n2m from "./notion2md";
import {
  QueryResult,
  QueryResultWithMarkdownContents,
  Relation,
} from "@/lib/notion/schema";

type Config = {
  withRelations?: boolean | string[];
  recursive?: boolean;
  maxDepth?: number;
  withBlocks?: boolean;
  sorts?: Array<
    | {
        property: string;
        direction: "ascending" | "descending";
      }
    | {
        timestamp: "created_time" | "last_edited_time";
        direction: "ascending" | "descending";
      }
  >;
  filter?: any;
};

export default async function getData<ItemProperties>(
  database_id: string,
  config?: Config
): Promise<QueryResultWithMarkdownContents<ItemProperties>[]> {
  let depth = 1;
  const database = (
    await notion.databases.query({
      database_id,
      sorts: config?.sorts,
      filter: config?.filter,
    })
  ).results as unknown as QueryResult<ItemProperties>[];

  for (const item of database) {
    await getItem(item, depth, config);
  }
  const items = database as QueryResultWithMarkdownContents<ItemProperties>[];
  return items;
}

function transformChildDatabase(block: any) {
  const { type, id } = block as any;
  // const child_database = block[type];
  return "";
  /*   const data = await getData(id, {
    withPages: false,
  });
  console.log(data);
  if (!child_database[type]?.url) return;
  return `<figure>
    <iframe src="${child_database[type]?.url}"></iframe>
  </figure>`; */
}

async function getItem<ItemProperties>(
  item: QueryResult<ItemProperties>,
  depth: number,
  config?: Config
) {
  if (config?.maxDepth && depth > config?.maxDepth) {
    return;
  }
  for (const name in item.properties) {
    const property = item.properties[name] as Relation<{}>;
    if (
      property.type === "relation" &&
      (config?.withRelations ||
        (Array.isArray(config?.withRelations) &&
          config?.withRelations.includes(name)))
    ) {
      const items = [];
      for (const relation of property.relation) {
        const response = await notion.pages.retrieve({
          page_id: relation.id,
        });
        if (config.recursive) {
          await getItem(
            response as unknown as QueryResult<ItemProperties>,
            depth + 1,
            config
          );
        }
        items.push(response);
      }
      property.items = items as any;
    }
  }
  if (config?.withBlocks) {
    const { results } = await notion.blocks.children.list({
      block_id: item.id,
    });
    const x = await n2m.blocksToMarkdown(results);
    n2m.setCustomTransformer("child_database", transformChildDatabase);
    (item as QueryResultWithMarkdownContents<ItemProperties>).markdownContents =
      n2m.toMarkdownString(x).parent;
  }
}
