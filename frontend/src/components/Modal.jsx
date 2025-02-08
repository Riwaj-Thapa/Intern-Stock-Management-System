import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Modal component definition
export default function Modal({ isOpen, onClose, title, children }) {
  return (
    // Transition component to handle the modal's appear and disappear animations
    <Transition appear show={isOpen} as={Fragment}>
      {/* Dialog component to represent the modal */}
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Background overlay with fade-in and fade-out animations */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal panel with zoom-in and zoom-out animations */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Modal title */}
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {title}
                </Dialog.Title>
                {/* Modal content passed as children */}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
