import IVector2D from "../../Render/Types/IVector2D";

export default (startPosition: IVector2D, size: IVector2D, target: IVector2D) => {
  return startPosition.x <= target.x && target.x <= startPosition.x + size.x && startPosition.y <= target.y && target.y <= startPosition.y + size.y;
};
