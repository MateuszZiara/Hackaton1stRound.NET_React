import {Flex} from "@mantine/core";
import {Navbar} from "../../layouts/Navbar/Navbar";
import classes from "./Panel.module.css"

export default function Panel() {
    return (
        <Flex
            gap="sm"
            justify="flex-end"
            align="start"
            direction="row"
            wrap="nowrap"
        >
            <div>
            <Navbar/>
            </div>
        </Flex>
    );
}