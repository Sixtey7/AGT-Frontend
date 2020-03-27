<template>
    <div>
        <v-btn id = "upload-button" color = "primary" dark @click="$refs.uploadFile.click()">Upload
            <v-icon dark right>cloud_upload</v-icon>
        </v-btn>
        <input type = "file" ref = "uploadFile" @change = "uploadCSV" v-show="false"/>
    </div>
</template>
<script>
export default {
    name: 'UploadButton',
    methods: {
        uploadCSV() {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.$emit("upload", e.target.result);
            }
            fileReader.readAsText(this.$refs.uploadFile.files[0]);
        }
    }
}
</script>
<style>
</style>