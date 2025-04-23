-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "partner_company" TEXT,
    "required_hours" INTEGER,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "certificationId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateTask" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estimated_hours" INTEGER,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "TemplateTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "target_end_date" TIMESTAMP(3),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "custom_note" TEXT,

    CONSTRAINT "UserPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTask" (
    "id" SERIAL NOT NULL,
    "userPlanId" INTEGER NOT NULL,
    "templateTaskId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "UserTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours_studied" INTEGER NOT NULL,
    "tasks_completed" INTEGER NOT NULL,

    CONSTRAINT "ProgressLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateTask" ADD CONSTRAINT "TemplateTask_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_userPlanId_fkey" FOREIGN KEY ("userPlanId") REFERENCES "UserPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_templateTaskId_fkey" FOREIGN KEY ("templateTaskId") REFERENCES "TemplateTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressLog" ADD CONSTRAINT "ProgressLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
