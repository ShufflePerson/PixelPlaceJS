interface IImageData {
    buffer: Buffer,
    metadata: {
        width: number,
        height: number
    }
}

export default IImageData;