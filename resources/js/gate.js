export default class Gate{
    consutructor (user){
        this.user = user;
    }

    isAdmin(){

        return this.user.type === 'admin';
    }

    
    isUser(){

        return this.user.type === 'user';
    }
}