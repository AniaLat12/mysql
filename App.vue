<template>
<div id="root" v-if="res!==''">
    <nav> 
  <div class="menu">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg class="account-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg> 
  </div>
  <ul> 
      <li v-for="db in databases" :key="db.Database" @click="useDb(db.Database)"> 
        <div class="nav-el"> 
            <a>
              <span>{{db.Database}}</span>
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <hr>
          </div>
      </li>

  </ul>
</nav>
<main> 
  <header> 
    <button type="submit" @click="showStructure()">Structure</button>
    <button type="submit" @click="showInsert()">Insert</button>
    <button type="submit" @click="showConsole()">Console</button>
    <span style="color: wheat">Tables: </span>
    <span v-for="table in tables" :key="table" id="table-list" @click="descTable(table['Tables_in_'+db]); this.isShowConsole = false">
      {{ table[`Tables_in_${db}`] }} |
    </span>
    <br>
  </header> 


  <section v-if="isShowInsert">
    <span v-if="tables==''">
      You dont choose a table
    </span>
    <div v-else>
      <span style="font-size:1.5rem; padding: 2rem;">Insert date into {{ table }}</span>
      <table>
        <tr>
          <td v-for="key in structure" :key="key">
            {{key.Field}}
          </td>
        </tr>
        <tr>
          <td v-for="key in structure" :key="key" :class="`id ${key.Field}`"><input id="insert-input" type="text"></td>
        </tr>
      </table>
      <button type="submit" @click="insert()">Insert</button>
      {{test}}
    </div>
  </section>


  <section class="consol" v-if="isShowConsole">
      <form @submit.prevent="sendQuery()" method="post">
        <textarea name="query" v-model="query" cols="30" rows="10" @keyup="changeColor(this)">
        </textarea>
        <button type="submit">
            Execute
        </button>
    </form>
  </section>

  <section v-if="isShowStructure">
      <div class="table-title">{{ table.toUpperCase() }}</div>
    <table>
      <tr>
        <th>NAME</th>
        <th>TYPE</th>
        <th>NULL</th>
        <th>KEY</th>
        <th>DEFAULT</th>
        <th>EXTRA</th>
      </tr>
      <tr v-for="src in structure" :key="src.Field">
        <td> {{src.Field}} </td>
        <td> {{src.Type}} </td>
        <td> {{src.Null}} </td>
        <td> {{src.Key}} </td>
        <td> {{src.Default}} </td>
        <td> {{src.Extra}} </td>

      </tr>
    </table>
  </section>
  <article v-if="isShowConsole"> 
    <!--  SELECT * FROM users -->

    <table v-if="dataFromQuery!==''">
      <tr>
        <th v-for="item in keys" :key="item"> {{ item }} </th>
      </tr>
      <tr v-for="(row, i) in dataFromQuery" :key="row">
        <td v-for="key in keys" :key="key">
          {{ row[key] }}
        </td>
      </tr>
    </table>

  </article>
</main>
</div>
</template>

<script>
import axios from "axios";
export default {
  data(){
    return {
      res: '',
      databases: '',
      query: 'ddd',
      tables: JSON.parse(localStorage.getItem('tables')),
      db: localStorage.getItem("db"),
      table: '',
      structure: '',
      dataFromQuery: '',
      keys: '',
      test: '',
      // components
      isShowConsole: localStorage.getItem("console"),
      isShowStructure: localStorage.getItem("structure"),
      isShowInsert: localStorage.getItem("insert"),
    }
  },
  methods: {
    async get(){
      await axios.get("http://localhost:3000/").then(res=> {
        this.res = res
        this.databases = res.data.dbs
        this.query = res.data.query
      })
    },
    async useDb(v){
      await axios
        .get(`http://localhost:3000/db/${v}`)
        .then(res=>{
          this.tables = res.data.tables; this.db = res.data.db
          // [ { "Tables_in_demeter": "category" }, { "Tables_in_demeter": "products" }, { "Tables_in_demeter": "users" } ] 
          const { db, tables } = res.data;
          localStorage.setItem("tables", JSON.stringify(tables));
          localStorage.setItem("db", db);
        })
    },
    async descTable(v){
      this.table = v;
      await axios
        .get(`http://localhost:3000/desc/${this.db}/${v}`)
        .then(res=>{this.structure = res.data.strucute})
    },
    async sendQuery(){
      const value = document.querySelector("textarea").value;
      await axios.post(`http://localhost:3000/query/${this.db}`, { data: value })
      .then(res => {
        this.dataFromQuery = res.data.data
        this.keys = Object.keys(this.dataFromQuery[0])
        console.log(this.keys);
      });
    },
    insert(){
      const rows = document.querySelectorAll(".id");
      console.log(rows)
      // this.test = rows

    },
    // displaing
    showConsole(){
      localStorage.setItem("console", true);
      localStorage.setItem("insert", false);
      localStorage.setItem("structure", false);
      this.isShowInsert = false;
      this.isShowStructure = false;
      this.isShowConsole = true;
    },
    showStructure() {
      localStorage.setItem("structure", true);
      localStorage.setItem("insert", false);
      localStorage.setItem("console", false);
      this.isShowConsole = false;
      this.isShowInsert = false;
      this.isShowStructure = true;
    },
    showInsert(v = null){
      localStorage.setItem("insert", true);
      localStorage.setItem("console", false);
      localStorage.setItem("structure", false);
      this.isShowConsole = false;
      this.isShowStructure = false;
      this.isShowInsert = true;
    },
    changeColor(el){
      const keyWords = ['SELECT', "FROM", "WHERE", "LIKE", "BETWEEN", "AND", "OR", "TRUE", "NULL", "NOT IN", "FALSE"];
      const textarea = document.querySelector("textarea");
      keyWords.forEach(word => {
        textarea.value == word ? textarea.style.color="red" : null;
      })
    },
  },
  mounted(){
    this.get()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@100&display=swap');

::-webkit-scrollbar{
  width: 10px;
  background-color: white;
}

::-webkit-scrollbar-thumb{
  background:black;
}

html, body{
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    background: #272525;
    color: white;
}
nav{
    position: fixed;
    background: #1E1D1D;
    height: 100%;
    width: 15%;
    font-size: 18px;
    font-family: 'Rubik', sans-serif;
    /* font-family: 'Raleway', sans-serif; */
    font-style: normal;
    font-weight: normal;
    display: grid;
    grid-template-rows: 10% 90%;
    grid-template-columns: 1fr;
    overflow-y: scroll;
}

ul{
    list-style: none;
    width: 100%;
    height: 80%;
    padding: 0;
}

ul a{
  color: white;
}
.table-title{
  color:wheat;
  font-size: 1.5rem;
  padding: 1rem;
}

.nav-el{
    width: 100%;
    height: 10%;
    float: left;
    margin-top: 10px;
}

#table-list, header button, nav li{
  cursor: pointer;
}


main{
    height: 100%;
    width: 85%;
    float: right;
    /* padding: 10px; */
}

.menu{
    font-size: 3rem;
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    position: relative;
}

.menu svg{
    height: 3rem;
    position: relative;
}

ul svg{
    height: 26px;
    display: inline-block;
    float: right;
}

header{
    width: 100%;
    height: 10%;
    padding: 0;
    margin: 0;
}

.consol{
    position: relative;
    left: 50%;
    top: .5rem;
    transform: translate(-50%);
    height: 30%;
    width: 85%;
    background: #1E1D1D;
}

form{
    background: inherit;
    width: 100%;
    height: 100%;
}

#insert-input{
  text-align: center;
  height: 100%;
  width: 95%;
  padding: .2rem;
  background: inherit;
  border: none;
  outline: none;
  color: white;
  font-size: 1.5rem;
}

textarea{
    padding: 1rem;
    color: white;
    font-size: 1.2rem;
    resize: none;
    height: 100%;
    width: 100%;
    text-decoration: none !important;
    background: #1E1D1D;
    border: none;
    position: relative;
    display: inline-block;
    outline:none;
    text-decoration-style: solid;
    text-decoration-line: none;
}
td{ padding:0;} 
section button{
    position: absolute;
    float: right;
    border: none;
    height: 1.5rem;
    border-radius:.5rem;
    background: white;
    bottom: 1rem;
    right: 1rem;
}
a{
    text-decoration: none;
    color:#1E1D1D

}

textarea:focus{
    outline: none;
}

article{
    height: 60%;
    width: 100%;
}

header button{
    background: white;
    border: none;
    font-size: 1rem;
    border-radius: 0.5rem;
    height: 2rem;
    width: 5rem;
    margin: 1rem;
}

/* TABLE  */
table{
    width: 100%;
    /* height: 90%; */
    text-align: center;
    border-spacing: .5rem;
}
th{
    background: #1A1818;
}

tr{
    background: #1F1E1E;
    width: 4rem;
    /* height: 23px; */
    line-height: 42px; 
}

table a, table a:visited{
    float: right;
    padding-right: 5px;
    color: white;
}

table a:hover{
    float: right;
    padding-right: 5px;
    color: rgb(206, 200, 200);
}

table svg{
    height: 2rem;
    margin: 0;
}

</style>
