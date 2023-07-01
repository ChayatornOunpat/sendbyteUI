<script>
    import Footer from "./Footer.svelte";

    const serverURL = "http://localhost:8000"
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";

    let files = {
        accepted: [],
        rejected: []
    };

    function handleFilesSelect(e) {
        const {acceptedFiles, fileRejections} = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }
</script>

<div class="h-screen flex items-center flex-col">
    <p class="mt-12 mb-12 text-lg text-center w-8/12">Drop your file here. When you click "Send," you'll get a link to
        the file, a QR code that leads to it, or a code
        that you can enter on our site's "Receive" page.</p>
    <div class="card bg-base-100 shadow-xl w-10/12 mb-24">
        <figure class="px-1 pt-1">
            <Dropzone on:drop={handleFilesSelect}/>
        </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title mb-2 mt-1">Send list</h2>
            <ol>
                {#each files.accepted as item}
                    <li>{item.name}</li>
                {/each}
            </ol>
            <div class="card-actions mt-2 mb-2">
                <button class="btn btn-primary w-20">Go</button>
            </div>
        </div>
    </div>
    <Footer></Footer>
</div>


<style>

</style>