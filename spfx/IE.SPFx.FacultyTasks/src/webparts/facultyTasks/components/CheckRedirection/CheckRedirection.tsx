import * as React from "react";
import { useNavigate } from "react-router-dom";
import { app } from "@microsoft/teams-js";

const CheckRedirection: React.FC = () => {
    const navigate = useNavigate();
    const hasRedirected = React.useRef(false);

    React.useEffect(() => {
        if (hasRedirected.current) return;

        const loadParam = async (): Promise<void> => {
            try {
                const context = await app.getContext();
                const subEntityId = context.page?.subPageId;
                if (subEntityId) {
                    hasRedirected.current = true;
                    navigate(`/${subEntityId}`, { replace: true });
                }
            } catch (err) {
                console.error("Error al obtener el contexto de Teams:", err);
            }
        };
        loadParam().catch(console.error);
    }, [navigate]);

    return null;
};
export default CheckRedirection;