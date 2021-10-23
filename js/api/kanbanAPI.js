export default class KanbanAPI {
  static getItems(columnId) {
    const column = read().find((column) => column.id == columnId);
    if (!column) {
      return [];
    }
    return column.items;
  }

  static insertItem(columnId, content) {
    const data = read();
    const column = data.find((column) => column.id == columnId);
    const item = {
      id: Math.floor(Math.random() * 100000),
      content,
    };
    if (!column) {
      throw new Error("Column not found");
    }
    column.items.push(item);
    save(data);
    return item;
  }

  static updateItem(itemId, newProps) {
    const data = read();
    const [item, currentColumn] = (() => {
      for (const column of data) {
        const item = column.items.find((item) => item.id == itemId);

        if (item) {
          return [item, column];
        }
      }
    })();

    if (!item) {
      throw new Error("Item not found");
    }

    item.content =
      newProps.content === undefined ? item.content : newProps.content;

    //   Update column and position

    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      const targetColumn = data.find(
        (column) => column.id == newProps.columnId
      );
      //   console.log(targetColumn, item);
      if (!targetColumn) {
        throw new Error("Target column not found");
      }
      //   Delete the item from it's current column
      currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

      //   Move item to it;s new position and column
      targetColumn.items.splice(newProps.position, 0, item);
    }
    save(data);
  }

  static deleteItem(itemId) {
    const data = read();
    for (const column of data) {
      const item = column.items.find((item) => item.id == itemId);
    }
    if(!item){
      continue
    }
    column.items.splice(column.items.indexOf(item),1)
  }
}

function read() {
  const json = localStorage.getItem("kanban-data");

  if (!json) {
    return [
      {
        id: 1,
        items: [],
      },
      {
        id: 2,
        items: [],
      },
      {
        id: 3,
        items: [],
      },
    ];
  }
  return JSON.parse(json);
}

function save(data) {
  localStorage.setItem("kanban-data", JSON.stringify(data));
}
