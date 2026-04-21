import { sayHi } from "../game.js";

class StartPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section id="" class="flex flex-col justify-center gap-2 p-3">
                <div class="flex flex-col items-center">
                    <h1>BlazeTap 🔥</h1>
                    <p class="text-left">By: Khaled - v3.0</p>
                </div>
                <button id="voglXuB37z" class="btn btn-primary">Normal Mode</button>
                <button id="N2j9PeStaH" class="btn btn-primary">Silly Mode</button>
            </section>
        `;

        this.normalModeBtn = this.querySelector("#voglXuB37z");
        this.sillyModeBtn = this.querySelector("#N2j9PeStaH");

        this.normalModeBtn.addEventListener("click", () => { sayHi })
    }
}

customElements.define('start-page', StartPage);
