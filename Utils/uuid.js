const   uuidBlocks = [8, 4, 4, 4, 12], 
        uuidBlockSeperator = '-', 
        uuidChars = [...'0123456789abcdef'], 
        uuidSegment = chars => chars[Math.floor(Math.random() * (chars.length - 1))],  
        uuid = (
            blocks = uuidBlocks, 
            seperator = uuidBlockSeperator, 
            chars = uuidChars
        ) => blocks.reduce(
            (blocks, blockSize) => [
                ...blocks, 
                [...Array(blockSize)].map(uuidSegment.bind(null, chars)).join('')
            ], 
            []
        ).join(seperator); 
        
export default uuid;