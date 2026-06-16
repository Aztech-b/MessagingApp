import { Card, Divider, Group, Text } from "@mantine/core";
import { motion } from "motion/react";

function MyCard({ icon, title, description, animate, delay }) {
    return (
        <motion.div animate={animate} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}>
            <Card
                // mt={mt}
                // mb={"auto"}
                shadow="md"
                padding="md"
                bg={"var(--surface)"}
                withBorder
                bd="1px solid var(--accent-bg)"
            >
                <Group>
                    {icon}
                    <p>{title}</p>
                </Group>
                <Divider size={"sm"} my={12}></Divider>
                <Text c="dimmed">{description}</Text>
            </Card>
        </motion.div>
    );
}

export default MyCard;
