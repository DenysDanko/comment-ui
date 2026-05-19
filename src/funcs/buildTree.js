export function buildTree(comments) {
  const map = {};
  comments.forEach(c => map[c.id] = { ...c, replies: [] });
  const tree = [];
  comments.forEach(c => {
    if (c.parentId) {
      if (map[c.parentId]) {
        map[c.parentId].replies.push(map[c.id]);
      }
    } else {
      tree.push(map[c.id]);
    }
  });
  return tree;
}
