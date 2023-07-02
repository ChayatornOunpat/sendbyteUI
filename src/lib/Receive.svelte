<script>
    import Footer from "./Footer.svelte";
    import JSZip from "jszip";
    import {onMount} from 'svelte';
    import {useParams} from "svelte-navigator";

    const params = useParams();

    const serverURL = "http://localhost:8000"
    let code = null;

    onMount(() => {
        if ($params.code !== '') {
            code = $params.code
        }
    });

    async function downloadFile(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            await unzipAndDownload(blob);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    async function unzipAndDownload(blob) {
        try {
            const zip = await JSZip.loadAsync(blob);
            const promises = [];
            zip.forEach(async (relativePath, zipEntry) => {
                const fileBlob = await zipEntry.async('blob');
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(fileBlob);
                downloadLink.download = zipEntry.name;
                downloadLink.click();
            });
            await Promise.all(promises);
        } catch (error) {
            console.error('Error unzipping file:', error);
        }
    }

    async function handleDownload() {
        if (code !== null) {
            await downloadFile(`${serverURL}/receive/files/${code}`)
        }
    }
</script>

<div class="min-h-screen">
    <div class="hero min-h-screen"
         style={`background-image: url(${serverURL}/receive/bg);`}>
        <div class="hero-overlay bg-opacity-60"></div>
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">Send!</h1>
                <p class="py-6">Drop your file here. When you click "Send," you'll get a link to
                    the file, a QR code that leads to it, or a code
                    that you can enter on our site's "Receive" page.</p>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-stone-800">
                <div class="card-body">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">File code</span>
                        </label>
                        <input type="text" placeholder="code" class="input input-bordered" bind:value={code}/>
                    </div>
                    <div class="form-control mt-6">
                        <button class="btn btn-primary" on:click={handleDownload}>Download</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer></Footer>
</div>


<style>

</style>