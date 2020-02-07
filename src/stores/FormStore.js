import { decorate, action, observable } from "mobx";
import {getAxios} from '../api/index'
import { toast } from "react-toastify";

class FormStore {
  state = {
    author: {
      value: "",
      label: "Author",
      required: true,
      enabled: true
    },
    story_title: {
      value: "",
      label: "Title",
      required: true,
      enabled: true
    },
    body: "",
    tags: {
      value: "",
      required: true,
      enabled: true,
      label: "Tags"
    },
    sent_to_others: {
      value: null,
      required: true,
      enabled: true,
      label: "Sent To Others"
    },
    email: {
      value: "",
      required: true,
      enabled: true,
      label: "Email"
    }
  }

  changes = false;

  setInitial(data) {
    this.config = {...this.config, ...data}
  }

  setState(data) {
    this.setChanges(true)
    this.state= {...this.state, ...data}
  }

  setChanges(state) {
    this.changes = state;
  } 

  save(website) {
    const payload = {
      ...this.state,
      website
    };

    getAxios({
      url:'/submissionForm/save',
      method: 'post',
      data: payload
    })
    
    this.changes = false;
  }

  submit = (website, e) => {
    e.preventDefault();
    const payload = {
      ...this.state,
      website
    };

    [payload.author, payload.story_title, payload.tags, payload.email].forEach(x => {
      if (x.required && !x.value) toast.error(`${x.label} is required`)
    })

    if (payload.sent_to_others.required && payload.sent_to_others.value === null) return toast.error("Sent to others is required") 

    // getAxios({
    //   url:'/submissionForm/save',
    //   method: 'post',
    //   data: payload
    // })
    
    this.changes = false;
  }

}

decorate(FormStore, {
  setState: action,
  state: observable
})

export default new FormStore();