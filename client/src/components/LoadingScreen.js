import "../styles/loadingScreen.css";
import { ThreeDots } from "react-loader-spinner";

export default function LoadingScreen() {

    return (
        <dialog className="dialog loadingScreenDialog">
            <ThreeDots 
                height="100" 
                width="100" 
                radius="12"
                color="#64bcff" 
                ariaLabel="three-dots-loading"
            />
        </dialog>
    );
}

export function showLoadingScreen() {
    const loadingScreenDialog = document.querySelector(".loadingScreenDialog");
    loadingScreenDialog.showModal();
};

export function hideLoadingScreen() {
    const loadingScreenDialog = document.querySelector(".loadingScreenDialog");
    loadingScreenDialog.close();
};