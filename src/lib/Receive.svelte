<script>
    import Footer from "./Footer.svelte";
    import JSZip from "jszip";
    import {onMount} from 'svelte';
    import {useParams} from "svelte-navigator";

    const params = useParams();

    const serverURL = "http://localhost:8000"
    let code = null;
    let loading = false;
    let progress = 0;

    onMount(() => {
        if ($params.code !== '') {
            code = $params.code
        }
    });

    function progressHandler(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progress = Math.round(percentComplete)
        }
    }

    async function downloadFile(url) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.upload.addEventListener('progress', progressHandler);

        xhr.onloadend = function () {
            if (xhr.status === 200) {
                const blob = xhr.response;
                unzipAndDownload(blob);
            } else {
                loading = false;
                if (xhr.status === 404) {
                    alert("File not found");
                } else {
                    alert(`Error downloading file: ${xhr.statusText}`);
                }
            }
        };

        xhr.onerror = function (error) {
            loading = false;
            console.error('Error downloading file:', error);
        };

        xhr.open('GET', url, true);
        xhr.send();
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
         style={`background-image: url(${serverURL}/bg/receive);`}>
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
                            <button class="btn btn-primary text-white" on:click={handleDownload}>Download</button>
                        </div>
                    {:else}
                        <div class="flex justify-center items-center">
                            <div class="radial-progress" style={`--value:${progress};`} role="progressbar">{progress}%
                            </div>
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