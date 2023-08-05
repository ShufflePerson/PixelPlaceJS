import EError from "./EError";

interface IError {
  id: EError;
  info?: string;
  message?: string;
}

export default IError;
