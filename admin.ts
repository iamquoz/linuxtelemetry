import express, { Request, Response } from "express";
import { register } from "./auth";
import pc from "./responces/pc";
import pcs from "./responces/pcs";
import { 
    addpermgroup, 
    perms, 
    perm, 
    allusersforperm, 
    deletepc, 
    addnote, 
    giveperms, 
    removeperms, 
    deleteperm, 
    addclearance, 
    users,
    allpcsforperm
} from "./sql";

const admin = express.Router();

admin.use((req: Request, res: Response, next: express.NextFunction) => {
	if (req.signedCookies.user !== 'admin') 
		res.status(401).json({ message: 'Unauthorized'})
	else 
		next();
})

admin.get('/user', (req: Request, res: Response) => {
    users()
        .then(r => res.status(200).send(r.rows))
        .catch(err => {
            console.log(err, 'get/perms'); 
            res.status(500).end()
        })
})

// POST
// /admin/user
// add a user to the system
admin.post('/user', (req: Request, res: Response) => {
    register(req, res);
})

// GET 
// /admin/perms
// get list of all permissions
admin.get('/perms', (req: Request, res: Response) => {
    perms()
        .then(r => res.status(200).send(r.rows))
        .catch(err => {
            console.log(err, 'get/perms'); 
            res.status(500).end()
        })
})

// GET
// /admin/perms/:id
// get permission with id = id
admin.get('/perms/:id', (req: Request, res: Response) => {
    const permid: number = parseInt(req.params.id);

    perm(permid)
        .then(r => res.status(200).send(r.rows))
        .catch(err => {
            console.log(err, 'get/perms/:id'); 
            res.status(500).end()
        })
})

// GET
// /admin/perms/:id/user
// get all users who have permission with id = id
admin.get('/perms/:id/user', (req: Request, res: Response) => {
    const permid: number = parseInt(req.params.id);

    allusersforperm(permid)
        .then(r => res.status(200).send(r.rows))
        .catch(err => {
            console.log(err, 'get/perms/:id/users'); 
            res.status(500).end()
        })
})

// GET
// /admin/perms/:id/pc
// get all pcs with clearance = id
admin.get('/perms/:id/pc', (req: Request, res: Response) => {
    const permid: number = parseInt(req.params.id);

    allpcsforperm(permid)
        .then(r => res.status(200).send(r.rows))
        .catch(err => {
            console.log(err, 'get/perms/:id/pc'); 
            res.status(500).end()
        })
})

// POST
// /admin/perms/:id/user
// give permission to a user
admin.post('/perms/:id/user', (req: Request, res: Response) => {
    const permid: number = parseInt(req.params.id);
    const username: string = req.body.username;

    giveperms(username, permid)
        .then(_ => res.status(200).end())
        .catch(err => {
            console.log(err, 'post/perms/:id/user'); 
            res.status(500).end()
        })
})

// POST
// /admin/perms/:id/pc/:pcid
// add clearance to a pc
admin.post('/perms/:id/pc/:pcid', (req: Request, res: Response) => {
    const permid: number = parseInt(req.params.id);
    const pcid: number = parseInt(req.params.pcid);

    addclearance(pcid,permid)
        .then(_ => res.status(200).end())
        .catch(err => {
            console.log(err, 'post/perms/:id/pc/:pcid'); 
            res.status(500).end()
        })
})

// DELETE
// /admin/perms/:id/user
// remove permission from a user
admin.delete('/perms/:id/user', (req: Request, res: Response) => {
    const permid: number = parseInt(req.params.id);
    const username: string = req.body.username;

    removeperms(username, permid)
        .then(_ => res.status(200).end())
        .catch(err => {
            console.log(err, 'delete/perms/:id/user'); 
            res.status(500).end()
        })
})

// POST
// /admin/perms
// add permission
admin.post('/perms', (req: Request, res: Response) => {
    const permname: string = req.body.permname;

    addpermgroup(permname)
        .then(r => res.status(200).send(r.rows))
        .catch(err => {
            console.log(err, 'post/perms'); 
            res.status(500).end();
        })
})

// DELETE
// /admin/perms
// delete permission
admin.delete('/perms', (req: Request, res: Response) => {
    const permid: number = parseInt(req.params.id);

    deleteperm(permid)
        .then(_ => res.status(200).end())
        .catch(err => {
            console.log(err, 'delete/perms'); 
            res.status(500).end()
        })
})

// GET
// /admin/pc
// get all pcs
admin.get('/pc', (req: Request, res: Response) => {
    pcs(req, res);
})

// GET 
// /admin/pc/:name
// get pc stats
admin.get('/pc/:name', (req: Request, res: Response) => {
    pc(req, res);
})

// DELETE
// /admin/pc/:name
// delete pc from the db
admin.delete('/pc/:name', (req: Request, res: Response) => {
    const pcid: number = parseInt(req.params.name);
    deletepc(pcid)
        .then(_ => res.status(200).end())
        .catch(err => {
            console.log(err, 'delete/pc/:name'); 
            res.status(500).end()
        })
})

// PATCH
// /admin/pc/:name
// add note to pc
admin.patch('/pc/:name', (req: Request, res: Response) => {
    const pcid: number = parseInt(req.params.name);
    const text: string = req.body.note;

    addnote(pcid, text)
        .then(_ => res.status(200).end())
        .catch(err => {
            console.log(err, 'patch/pc/:name'); 
            res.status(500).end()
        })
})

export default admin;
