/*
  Warnings:

  - The primary key for the `despesas` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_despesas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    CONSTRAINT "despesas_categoria_fkey" FOREIGN KEY ("categoria") REFERENCES "categorias" ("categoria") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_despesas" ("categoria", "descricao", "id", "valor") SELECT "categoria", "descricao", "id", "valor" FROM "despesas";
DROP TABLE "despesas";
ALTER TABLE "new_despesas" RENAME TO "despesas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
