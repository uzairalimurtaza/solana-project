import { toast } from "react-toastify";
export function ErrorHandler(error) {
  if (error.response) {
    if (error.response.status === 401) {
      toast.error(error.response.data.message);
      setTimeout(() => {
        // localStorage.clear();
        // window.location.href = "/";
      }, 2000);
    } else if (error.response.status === 400) {
      toast.error(error.response.data.message);
      return;
    } else {
      toast.error(error.response.data.message);
      return;
    }
  } else {
    console.log(error);
    return;
  }
}
