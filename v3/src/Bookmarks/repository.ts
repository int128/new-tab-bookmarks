import { BookmarkFolder, Subscription } from "./model";

export function subscribeBookmarks(handler: (bookmarkFolders: BookmarkFolder[]) => void): Subscription {
  function listener() {
    chrome.bookmarks.getTree(tree => handler(flatten(tree)));
  }
  chrome.bookmarks.onChanged.addListener(listener);
  chrome.bookmarks.onChildrenReordered.addListener(listener);
  chrome.bookmarks.onCreated.addListener(listener);
  chrome.bookmarks.onMoved.addListener(listener);
  chrome.bookmarks.onRemoved.addListener(listener);
  return {
    refresh() {
      listener()
    },
    unsubscribe() {
      chrome.bookmarks.onChanged.removeListener(listener);
      chrome.bookmarks.onChildrenReordered.removeListener(listener);
      chrome.bookmarks.onCreated.removeListener(listener);
      chrome.bookmarks.onMoved.removeListener(listener);
      chrome.bookmarks.onRemoved.removeListener(listener);
    }
  };
}

function flatten(nodes: chrome.bookmarks.BookmarkTreeNode[]): BookmarkFolder[] {
  return nodes.flatMap(traverse);
}

function traverse(node: chrome.bookmarks.BookmarkTreeNode, depth = 0): BookmarkFolder[] {
  if (node.children === undefined) {
    return []
  }

  const folderNodes = node.children.filter(child => child.url === undefined);
  const folders = folderNodes.flatMap(folderNode => traverse(folderNode, depth + 1));

  const bookmarkNodes = node.children.filter(child => child.url !== undefined);
  if (bookmarkNodes.length > 0) {
    const folder = {
      id: node.id,
      title: node.title,
      bookmarks: bookmarkNodes.map(b => ({
        title: b.title,
        url: b.url || '',
      })),
    };
    return [folder].concat(folders);
  }
  return folders;
}
