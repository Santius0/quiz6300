import {toast} from "react-toastify";

// displays error message is toast
const displayError = message => {
    if (process.env.NODE_ENV === "development") toast.error(message);
    else toast.error("Network Error. Please refresh the page or try again later.");
}

// displays success message in toast
const displaySuccess = message => {
    toast.success(message);
}

export {
    displayError,
    displaySuccess,
};