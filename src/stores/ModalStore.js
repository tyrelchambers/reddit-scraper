import { action,decorate, observable } from 'mobx';

class ModalStore {
  isOpen = false;

  setIsOpen(status) {
    this.isOpen = status;
  }

  getIsOpen() {
    return this.isOpen;
  }
}

decorate(ModalStore, {
  isOpen: observable,
  setIsOpen: action
});

export default new ModalStore();