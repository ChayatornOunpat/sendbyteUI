<script>
    import Footer from "./Footer.svelte";
    import {navigate} from "svelte-navigator";

    const serverURL = "http://localhost:8000"
</script>

<div>
    <div class="hero min-h-screen"
         style={`background-image: url(${serverURL}/home/bg);`}>
        <div class="hero-overlay bg-opacity-60"></div>
        <div class="hero-content text-center text-neutral-content">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold text-white">Sendbyte</h1>
                <h2 class="text-2xl mt-2 font-bold text-white">A sane file transfer solution</h2>
                <p class="py-6 text-white">Do you ever have any issues sending files across machines? Whether it be an
                    old
                    device with compatibility issues, an Apple device not cooperating with a Windows one, or a bad
                    Bluetooth
                    connection, Sendbyte has you covered. If you can connect to the internet, you can trust that we
                    will deliver the file every time.</p>
                <button class="btn btn-primary" on:click={() => navigate("/send")}>Get Started</button>
            </div>
        </div>
    </div>
    <Footer></Footer>
</div>

<style>

</style>
