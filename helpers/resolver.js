exports.resolver = function (maze, start, end) {
  let visitedBoxes = new Set();
  const directions = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];
  const minBoxes = findPath(start, end, visitedBoxes, maze, directions);

  if (minBoxes === Infinity) {
    console.error("Aucun chemin possible.");
    return false;
  }
  return minBoxes;
};

// Fonction récursive pour trouver la longueur minimale du chemin entre les boîtes 'start' et 'end' dans le labyrinthe.
// Utilise la recherche DFS (Depth-First Search) en évitant les boîtes déjà visitées et les boîtes non autorisées.
// Retourne la longueur minimale du chemin ou Infinity si aucun chemin n'est possible.

function findPath(currentBox, endBox, visitedBox, maze, directions) {
  if (currentBox === endBox) {
    return 1;
  }

  visitedBox.add(currentBox);
  let minPath = Infinity;

  for (const dir of directions) {
    let nextX = currentBox.x + dir.x;
    let nextY = currentBox.y + dir.y;

    const nextBox = maze.find((box) => box.x === nextX && box.y === nextY);

    if (nextBox && !visitedBox.has(nextBox) && nextBox.isAllowed) {
      const pathLength = findPath(
        nextBox,
        endBox,
        visitedBox,
        maze,
        directions
      );
      minPath = Math.min(minPath, pathLength + 1);
    }
  }
  visitedBox.delete(currentBox);
  return minPath;
}
