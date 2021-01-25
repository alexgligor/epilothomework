export const areMoreAdditonsThenDeletions = (files: any[]): boolean => {
    let deletions = 0;
    let additions = 0;

    files.forEach((file) => {
        deletions += file.deletions ? parseInt(file.deletions) : 0;
        additions += file.additions ? parseInt(file.additions) : 0;
    });

    return additions > deletions;
};
