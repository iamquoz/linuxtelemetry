interface pcEvent {
    pcname: string;
    time: number;
    app: string;
    innerid: number;
}

interface user {
    username: string;
    hash: string;
    perms: Array<string | number>;
}

interface pc {
    pcid: number;
    pcname: string;
    note: string;
    clearance: number;
}

interface permissions {
    permid: number;
    permname: string;
}

export {pcEvent, user, permissions, pc}