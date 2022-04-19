import {toast} from "react-toastify";

const displayError = message => {
    if (process.env.NODE_ENV === "development") toast.error(message);
    else toast.error("Network Error. Please refresh the page or try again later.");
}

const displaySuccess = message => {
    toast.success(message);
}

export {
    displayError,
    displaySuccess,
};