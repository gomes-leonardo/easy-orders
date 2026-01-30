-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('OPEN', 'PENDING', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'OPEN';
