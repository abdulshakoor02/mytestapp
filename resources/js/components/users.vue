<template>
    <div class="container">
        <div class="row mt-4 justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">User Data</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="newModal">Add New</button>
                            <!-- data-toggle="modal" data-target="#addNew" -->
                        </div>

                    </div>

                    <!-- <div class="card-body"> -->
                        <div class="card-body table-responsive p-0">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name}}</td>
                      <td>{{user.email}}</td>
                      <td>{{user.type}}</td>
                      <td><a href="#" @click="editModal(user)"><i class="fas fa-edit"></i></a>/ <a href="#" @click="deleteUser(user.id)"><i class="fas fa-trash-alt"></i></a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            
<div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 v-show="!editmode" class="modal-title" id="addNewLabel">Add New</h5>
        <h5 v-show="editmode" class="modal-title" id="addNewLabel">Update User Info</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form @submit.prevent="editmode ? updateUser() : CreateUser()">
      <div class="modal-body">

         <div class="form-group">
      <label>Name</label>
      <input v-model="form.name" type="text" name="name"
        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
      <has-error :form="form" field="name"></has-error>
    </div>

    <div class="form-group">
      <label>Email</label>
      <input v-model="form.email" type="text" name="email"
        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
      <has-error :form="form" field="email"></has-error>
    </div>

     <div class="form-group">
      <label>Type</label>
      <input v-model="form.type" type="text" name="type"
        class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
      <has-error :form="form" field="type"></has-error>
    </div>

     <div class="form-group">
      <label>Password</label>
      <input v-model="form.password" type="password" name="password"
        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
      <has-error :form="form" field="password"></has-error>
    </div>
    <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
    <button v-show="editmode" type="submit" class="btn btn-success">Update</button>

      </div>
      </form>
     
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        
         
      </div>
    </div>
  </div>
</div>

        </div>
    <!-- </div> -->
</template>

<script>
    export default {
        data() {
            return {
                editmode : false,
                users : {},
                form: new Form ({
                    id: '',
                    name : '',
                    email :'',
                    password : '',
                    type : '',
                })
            }
        },
        methods: {
            updateUser() {
                this.form.put('api/user/'+this.form.id)
                .then(()=> {
                    $('#addNew').modal('hide');
                    Fire.$emit('AfterCreate');
                        Swal.fire(
                        'Updated!',
                        'User data has been succesfully updated.',
                        'success'
                        )
                })
                .catch(()=>{
                    Swal.fire("Failed!","There was something wrong.","warning");
                })
            },
            editModal(user) {
                this.editmode=true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },
            newModal() {
                this.editmode=false;
                this.form.reset();
                $('#addNew').modal('show');
            },
            deleteUser(id){
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {

                        if(result.value) {
                        //send request to delete
                        this.form.delete('api/user/'+id)
                        .then(() => {
                        Fire.$emit('AfterCreate');
                        Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                        )
                        })
                        .catch(()=>{
                        Swal.fire("Failed!","There was something wrong.","warning");
                    })
                    }                   
                    })
                    
            },
            loadUsers() {
                axios.get("api/user").then(({ data }) => (this.users = data.data));
            },
            CreateUser(){
                this.$Progress.start();
                this.form.post('api/user')
                .then(() => {
                    Fire.$emit('AfterCreate');
                $('#addNew').modal('hide');
                Toast.fire({
                            icon: 'success',
                            title: 'User Created successfully'
                            })
                this.$Progress.finish();
                })
                .catch(() => {
                    Swal.fire("Failed!","There was something wrong.","warning");
                })
                
            }
        },
        created() {
            this.loadUsers();
            Fire.$on('AfterCreate',() => { this.loadUsers();});
            // console.log('Component mounted.')
        }
    }
</script>
