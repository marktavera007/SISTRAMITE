export default function AppLogo() {
    return (
        <div className="flex items-center">
            <div className="flex aspect-square size-8 items-center justify-center">
                <img src="/storage/logoIcon.png" className="size-8 fill-current object-cover" alt="" />
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
            </div>
            <div className="ml-1 w-full flex-1">
                <img src="/storage/logoSoft.png" className="max-w-[120px] fill-current object-cover" alt="" />
                {/* <span className="truncate leading-none font-semibold text-gray-950">Soft</span>
                <span className="truncate leading-none font-semibold text-orange-400">Kit</span> */}
            </div>
        </div>
    );
}
