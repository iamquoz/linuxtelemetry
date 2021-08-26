interface pcEvent {
    pcname: string;
    time: number;
    app: string;
    innerid: number;
}

interface user {
    login: string;
    hash: string;
}

export {pcEvent, user}