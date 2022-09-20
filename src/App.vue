<template>
  <div id="app" class="container p-5">
    <label for="formFile" class="form-label">Input file</label>
    <input class="form-control" type="file" id="formFile" ref="fileInput" />
    <button class="btn btn-warning mt-3" ref="btn" @click="f">Загрузка</button>
    <hr />
    <img class="m-5" :src="imgSrc" alt="Image" />
    <hr />
    <!--    <img class="m-5" src="http://localhost:3000/api/img" alt="Image2" />-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component
export default class App extends Vue {
  $refs!: {
    btn: HTMLButtonElement;
    fileInput: HTMLInputElement;
  };

  imgSrc = "";

  async f() {
    if (this.$refs.fileInput.files?.length) {
      let file: File = this.$refs.fileInput?.files[0];
      console.log(file);
      this.imgSrc = URL.createObjectURL(file);
      console.log(this.imgSrc);
      let data: FormData = new FormData();
      data.append("msg", "msg");
      data.append("cover", file);

      axios
        .post("http://localhost:3000/api/book", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.error(err));
      // let a = await fetch("http://localhost:3000", { method: "get" });
      // a.
    }
  }
}
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap";

#app {
}
</style>
