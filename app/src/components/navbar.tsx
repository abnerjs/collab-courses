import { NavigationMenuList } from "@radix-ui/react-navigation-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Link } from "react-router";
import logoPlain from "@/assets/logo-plain.svg";
import { Button } from "./ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

interface NavbarProps {
	sync?: () => void;
}

export function Navbar({ sync }: NavbarProps) {
	return (
		<div className="flex px-8 py-4 items-center justify-between w-full z-50">
			<NavigationMenu className="w-full flex flex-1 max-w-full justify-between *:flex *:flex-1">
				<NavigationMenuList className="flex flex-1">
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/">
								<img src={logoPlain} alt="Genu-in" className="size-6" />
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/">Início</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/matrix_trainings">Matriz de Treinamentos</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem className="ml-auto">
						<Button variant="default" onClick={sync}>
							Sincronizar
							<Icon icon="fluent:arrow-sync-12-regular" className="size-4" />
						</Button>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
