"use client";

import NewTaskDialogForm from "@/src/components/tasks/new-order-dialog";

export default function Testingpage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center text-center min-h-screen">
      <NewTaskDialogForm onCreateOrder={() => {}} />
    </div>
  );
}
