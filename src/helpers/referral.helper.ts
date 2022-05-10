import { v4 as uuidv4 } from 'uuid';

export function getReferral() {
    return (uuidv4().split("-"))[0];
 }