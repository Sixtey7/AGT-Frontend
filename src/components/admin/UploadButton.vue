<template>
    <div>
        <v-btn id = "upload-button" color = "primary" dark @click="$refs.uploadFile.click()">Upload
            <v-icon dark right>cloud_upload</v-icon>
        </v-btn>
        <input type = "file" ref = "uploadFile" @change = "uploadCSV" v-show="false"/>
    </div>
</template>
<script>
/**
 * Vue Component used to provide the user with an upload button
 * When the user clicks it, they are presented with an upload dialog
 * @vue-event {Object} upload - Emit the file the user choose to upload
 */
export default {
    name: 'UploadButton',
    methods: {
        /**
         * Called when the user selects to upload a file
         * Reads in the file and emits it
         * @vue-event {Object} upload - Emit the file the user choose to upload
         */
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