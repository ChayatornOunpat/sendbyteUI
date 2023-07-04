<script>
    import Footer from "./Footer.svelte";
    import JSZip from "jszip";
    import {onMount} from 'svelte';
    import {useParams} from "svelte-navigator";

    const params = useParams();

    const serverURL = "http://localhost:8000"
    let code = null;
    let loading = false;

    onMount(() => {
        if ($params.code !== '') {
            code = $params.code
        }
    });

    async function downloadFile(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const blob = await response.blob();
                await unzipAndDownload(blob);
            } else {
                loading = false;
                if ((response.status) === 404){
                    alert("file not found")
                } else {
                    alert(`Error downloading file: ${response.statusText}`)
                }
            }

        } catch (error) {
            loading = false
            console.error('Error downloading file:', error);
        }
    }

    async function unzipAndDownload(blob) {
        try {
            const zip = await JSZip.loadAsync(blob);
            const promises = [];

            zip.forEach((relativePath, zipEntry) => {
                const promise = new Promise(async (resolve) => {
                    const fileBlob = await zipEntry.async('blob');
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(fileBlob);
                    downloadLink.download = zipEntry.name;
                    downloadLink.click();
                    resolve(); // Resolve the promise after the downloadLink is clicked
                });
                promises.push(promise);
            });

            await Promise.all(promises);
            loading = false
        } catch (error) {
            console.error('Error unzipping file:', error);
            loading = false
        }
    }

    async function handleDownload() {
        if (code !== null) {
            loading = true;
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
                <h1 class="text-5xl font-bold">Receive!</h1>
                <p class="py-6">Enter the code you get from the send page here, click download, and voila, there is your
                    file.</p>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-stone-800">
                <div class="card-body">
                    {#if (loading === false)}
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">File code</span>
                            </label>
                            <input type="text" placeholder="code" class="input input-bordered" bind:value={code}/>
                        </div>
                        <div class="form-control mt-6">
                            <button class="btn btn-primary" on:click={handleDownload}>Download</button>
                        </div>
                    {:else}
                        <div class="flex justify-center items-center">
                            <span class='loading loading-dots loading-lg'></span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <Footer></Footer>
</div>

<style>

</style>