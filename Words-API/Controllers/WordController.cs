using Microsoft.AspNetCore.Mvc;
using Words_API.Services;

namespace Words_API.Controllers;

[ApiController]
[Route("[controller]")]
public class WordController : ControllerBase
{
    private WordService WordService;

    public WordController(WordService wordService)
    {
        this.WordService = wordService;
    }

    [HttpGet("/word-list")]
    public IEnumerable<string> GetWordList()
    {
        var words = this.WordService.GetAllWords();
        return words;
    }

    [HttpGet("/word-first")]
    public string GetFirstWord()
    {
        var words = this.WordService.GetAllWords();
        string word = words.First();
        return word;
    }

    Random random = new Random();

    [HttpGet("/random-word-list/amount={amount}")]
    public string[] RandomWordList(int amount)
    {
        string[] randomWordList = new string[0];

        var WordList = this.WordService.GetAllWords().ToList();

        for (int index = 0; index < amount; index++)
        {
            string randomWordFormList = WordList[random.Next(WordList.Count)];
            randomWordList = randomWordList.Append(randomWordFormList).ToArray();
        }
        return randomWordList;
    }
}
