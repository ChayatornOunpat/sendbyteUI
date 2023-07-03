<script>
    import Footer from "./Footer.svelte";
    import JSZip from "jszip";
    import QRCode from 'qrcode-generator';

    const serverURL = "http://localhost:8000"
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";

    let code = null;
    let loading = false;
    let qrURL = null;
    let files = {
        accepted: [],
        rejected: []
    };

    function genQr() {
        const qrCodeData = `${serverURL}/receive/${code}`; // The data you want to encode in the QR code

        const qr = QRCode(0, 'M');
        qr.addData(qrCodeData);
        qr.make();

        const qrCodeDataURL = qr.createDataURL(10, 0);
        qrURL = URL.createObjectURL(dataURLtoBlob(qrCodeDataURL));
    }

    function dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    function back() {
        code = null
        qrURL = null
        files.accepted = []
        files.rejected = []
    }

    async function handleSend() {
        loading = true;
        const zip = new JSZip();

        for (const file of files.accepted) {
            const reader = new FileReader();

            await new Promise((resolve, reject) => {
                reader.onload = () => {
                    zip.file(file.name, reader.result);
                    resolve();
                };

                reader.onerror = reject;

                reader.readAsArrayBuffer(file);
            });
        }

        try {
            const content = await zip.generateAsync({type: "blob"});
            const formData = new FormData();
            formData.append('file', content, 'zipped_files.zip');

            const response = await fetch(`${serverURL}/send/submitfile`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                loading = false
                const message = await response.json()
                code = message['code']
                genQr()
            } else {
                loading = false
                alert(`Failed to send content: , ${response.status}, ${response.statusText}`);
            }
        } catch (error) {
            loading = false
            alert(`Failed to send content:, ${error}`);
        }
    }

    function handleFilesSelect(e) {
        const {acceptedFiles, fileRejections} = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }
</script>

<div>
    <div class="hero min-h-screen"
         style={`background-image: url(${serverURL}/send/bg);`}>
        <div class="hero-overlay bg-opacity-60"></div>
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">Send!</h1>
                <p class="py-6">Drop your file here. When you click "Send," you'll get a link to
                    the file, a QR code that leads to it, or a code
                    that you can enter on our site's "Receive" page.</p>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm bg-stone-800 shadow-xl">
                <figure class="px-1 pt-1">
                    {#if (loading === false)}
                        {#if code === null}
                            <Dropzone on:drop={handleFilesSelect}/>
                        {:else}
                            {#if qrURL !== null}
                                <img src={qrURL} alt="QR code">
                            {/if}
                        {/if}
                    {/if}
                </figure>
                <div class="card-body items-center text-center">
                    {#if loading === false}
                        {#if code === null}
                            <h2 class="card-title mb-2 mt-1">Send list</h2>
                        {:else}
                            <h2 class="card-title mb-2 mt-1">{code}</h2>
                        {/if}
                        {#if code === null}
                            <ol>
                                {#each files.accepted as item}
                                    <li>{item.name}</li>
                                {/each}
                            </ol>
                        {:else}
                            <p>is your code</p>
                        {/if}
                        {#if code === null}
                            <div class="card-actions mt-2 mb-2">
                                <button on:click={() => handleSend()} class="btn btn-primary w-20">Go</button>
                            </div>
                        {:else}
                            <div class="card-actions mt-2 mb-2">
                                <button on:click={back} class="btn btn-primary w-20">return</button>
                            </div>
                        {/if}
                    {:else}
                        <div class="flex justify-center items-center">
                            <span class="loading loading-dots loading-lg"></span>
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