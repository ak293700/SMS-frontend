export class Sandbox
{
    static buildCancelChangeMessage(numberOfChanges: number): string
    {
        return numberOfChanges == 1
            ? `Vous avez ${numberOfChanges} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
            : `Vous avez ${numberOfChanges} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`;
    }

    static buildRegisterChangeMessage(numberOfChanges: number): string
    {
        return `Toute donnée modifiée ne pourra être retrouvé. ${numberOfChanges} modifications.`;
    }

}