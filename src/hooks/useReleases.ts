import { useQuery } from "@tanstack/react-query";
import { Endpoints } from '@octokit/types';

type ReleaseData = Endpoints["GET /repos/{owner}/{repo}/releases/latest"]["response"]["data"];

export const useYARGRelease = (version: "stable"|"nightly") => {
    const repositoryName = {
        "stable": "YARG",
        "nightly": "YARG-BleedingEdge"
    }

    return useQuery({
        queryKey: ["YARG", version],
        queryFn: async (): Promise<ReleaseData> => await fetch(`https://api.github.com/repos/YARC-Official/${repositoryName[version]}/releases/latest`).then(res => res.json())
    });
};