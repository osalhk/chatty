import { customAlphabet } from "nanoid";    
import User from "../models/User.js";

const generatecode = customAlphabet("0123456789,6");


const generateUniqueConnectCode = async () => {

    let code ,exists;

    do {
        code = generatecode();
        exists = await User.exists({ connectCode: code });
    } while (exists);

    return code;
}

export default generateUniqueConnectCode;