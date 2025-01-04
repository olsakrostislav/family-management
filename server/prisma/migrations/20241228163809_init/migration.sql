/*
  Warnings:

  - You are about to drop the column `productOwnedUserId` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "productOwnedUserId",
ADD COLUMN     "productOwnerUserId" INTEGER;
