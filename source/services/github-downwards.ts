export const areMoreAdditonsThenDeletions = (files: any[]): boolean => {
    var deletions: number = 0;
    var additions: number = 0;

    files.forEach((file) => {
        deletions += parseInt(file.deletions);
        additions += parseInt(file.additions);
    });
    return additions > deletions;
};
