function parseIncomingMessage(rawString: string): {
  identifier: string;
  data: any;
} {
  if (!rawString.startsWith("42")) {
    return { identifier: "", data: "" };
  }
  try {
    const jsonStartIndex = rawString.indexOf("[");
    const jsonString = rawString.slice(jsonStartIndex);
    const parsedData = JSON.parse(jsonString);
    const [emitName, data] = parsedData;
    return { identifier: emitName, data };
  } catch (error) {
    console.error("Error parsing Socket.IO emit:", error);
    console.log(rawString);
    return {
      identifier: "",
      data: ""
    };
  }
}

export default parseIncomingMessage;
