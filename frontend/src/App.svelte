<script lang="ts">
</script>

<main class="p-4 grid gap-2">
    <header class="flex items-center w-100 gap-4">
        <div class="bg-gray-3 flex-1 card-body">
            <div class="text-2xl font-bold">FBC Česká Lípa</div>

            <div class="flex gap-2">
                <button class="btn btn-primary">Gól</button>
                <button class="btn btn-outline-error">Vyloučení</button>
                <button class="btn btn-outline-warning">Timeout</button>
            </div>
        </div>

        <div class="divider divider-vertical h-32">vs</div>

        <div class="bg-gray-3 flex-1 card-body">
            <div class="text-2xl font-bold">ACEMA Sparta Praha</div>
            
            <div class="flex gap-2">
                <button class="btn btn-primary">Gól</button>
                <button class="btn btn-outline-error">Vyloučení</button>
                <button class="btn btn-outline-warning">Timeout</button>
            </div>
        </div>
    </header>

    <div>
        <label class="btn btn-primary" for="modal-2">Open Modal</label>

        <input class="modal-state" id="modal-2" type="checkbox" />
        <div class="modal w-screen">
            <label class="modal-overlay" for="modal-2"></label>
            <div class="modal-content flex flex-col gap-5 max-w-3xl">
                <label for="modal-2" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                <h2 class="text-xl">Modal title 2</h2>
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolorum voluptate ratione dicta. Maxime cupiditate, est commodi consectetur earum iure, optio, obcaecati in nulla saepe maiores nobis iste quasi alias!</span>
                <div class="flex gap-3">
                    <button class="btn btn-error btn-block">Delete</button>
                    <button class="btn btn-block">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <main>
        <div class="bg-gray-3 flex-1 card-body">
            <div>
                <div class="breadcrumbs text-sm pl-0">
                    <ul>
                        <li>
                            <span>FBC Česká Lípa</span>
                        </li>
                        <li>
                            <span>Branka</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="leading-relaxed text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Branku družstva <span class="text-primary">FBC Česká Lípa</span> vstřelila <span class="text-green-500">hráčka číslo 25, Štěpánka Haklová!</span>.<br>
                Asistovala jí hráčka číslo <span class="text-green-500">hráčka číslo 10, Daniela Jandáčová!</span><br>
                Stav utkání Česká Lípa Sparta Praha - 1:0
            </div>
        </div>

    </main>


    <form class="form-group">
        <div class="form-field">
            <label class="form-label text-error">
                Email address
                <span class="form-label-alt text-error">Alternative</span>
            </label>

            <input
                placeholder="Type here"
                type="email"
                class="input max-w-full input-error"
            />
            <label class="form-label">
                <span class="form-label-alt text-error"
                    >Please enter a valid email.</span
                >
                <span class="form-label-alt text-error">Alternative</span>
            </label>
        </div>
        <div class="form-field">
            <label class="form-label text-success">Email address</label>

            <input
                placeholder="Type here"
                type="email"
                class="input max-w-full input-success"
            />
            <label class="form-label">
                <span class="form-label-alt text-success"
                    >Please enter a valid email.</span
                >
            </label>
        </div>

        <div class="form-field">
            <label class="form-label text-warning">Email address</label>

            <input
                placeholder="Type here"
                type="email"
                class="input max-w-full input-warning"
            />
            <label class="form-label">
                <span class="form-label-alt text-warning"
                    >Please enter a valid email.</span
                >
            </label>
        </div>
    </form>
</main>
