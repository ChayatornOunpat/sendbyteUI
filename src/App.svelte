<script>
    import {Router, Route, navigate} from "svelte-navigator";
    import Home from "./lib/Home.svelte";
    import Send from "./lib/Send.svelte";
</script>

<div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle"/>
    <div class="drawer-content">
        <div class="navbar bg-base-200 w-screen sticky top-0 z-40">
            <div class="flex-none">
                <label for="my-drawer" class="ml-2 btn btn-square btn-ghost drawer-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         class="inline-block w-5 h-5 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <div class="flex-1">
            </div>
            <div class="flex-none">
                <p class="text-2xl mr-6">sendbyte</p>
            </div>
        </div>
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/send" component={Send}/>
        </Router>
    </div>
    <div class="drawer-side z-50">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 h-full bg-base-200 text-base-content">
            <li><a on:click={() => navigate("/")}>home</a></li>
            <li><a on:click={() => navigate("/send")}>send</a></li>
        </ul>
    </div>
</div>

<style>

</style>
