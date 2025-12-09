import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegTrashAlt } from "react-icons/fa";


interface DeleteModalProps {
 deleteInvoice: (id: number) => void;
 id: number;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ deleteInvoice, id }) => {
    
  return (
    <>
      <Dialog>
        <DialogTrigger asChild><FaRegTrashAlt className="h-5 w-5 text-red-500 hover:text-red-700 hover:cursor-pointer" /></DialogTrigger>

        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="bg-gray-100 border-2 border-gray-800 text-gray-800 font-bold px-4 py-2 rounded-md hover:bg-gray-200 transition hover:scale-105 hover:cursor-pointer">
                Cancel
              </button>
            </DialogClose>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition hover:scale-105 hover:cursor-pointer"
              onClick={() => deleteInvoice(id)}
            >
              Yes, Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteModal;
